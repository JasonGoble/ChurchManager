import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Organization, OrganizationLevel, OrganizationTree } from '../../core/models/organization.models';
import { OrganizationService } from '../../core/services/organization.service';
import { OrganizationFormDialogComponent } from './organization-form.dialog';
import { OrganizationSettingsDialogComponent } from './organization-settings.dialog';

const LEVEL_COLORS: Record<number, string> = {
  1: '#e3f2fd',
  2: '#f3e5f5',
  3: '#e8f5e9',
  4: '#fff8e1',
  5: '#fce4ec',
};

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [
    CommonModule, MatTreeModule, MatTableModule,
    MatButtonModule, MatButtonToggleModule, MatIconModule, MatChipsModule,
    MatTooltipModule, MatProgressSpinnerModule, MatDialogModule, MatCardModule,
    MatInputModule, MatFormFieldModule,
  ],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss',
})
export class OrganizationsComponent implements OnInit {
  private orgService = inject(OrganizationService);
  private dialog = inject(MatDialog);
  private bp = inject(BreakpointObserver);

  isMobile = toSignal(
    this.bp.observe('(max-width: 767px)').pipe(map(r => r.matches)),
    { initialValue: false }
  );

  viewMode = signal<'tree' | 'list'>('tree');
  loading = signal(false);
  searchText = signal('');

  private organizations = signal<Organization[]>([]);
  private levels = signal<OrganizationLevel[]>([]);

  filteredOrgs = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    const orgs = this.organizations();
    if (!q) return orgs;
    return orgs.filter(o =>
      o.name.toLowerCase().includes(q) ||
      (o.parentName ?? '').toLowerCase().includes(q) ||
      (o.city ?? '').toLowerCase().includes(q) ||
      (o.state ?? '').toLowerCase().includes(q) ||
      (o.country ?? '').toLowerCase().includes(q)
    );
  });

  // Tree
  @ViewChild(MatTree) private tree!: MatTree<OrganizationTree>;
  treeData = signal<OrganizationTree[]>([]);
  childrenAccessor = (node: OrganizationTree) => node.children ?? [];
  hasChild = (_: number, n: OrganizationTree) => !!n.children?.length;

  displayedColumns = ['name', 'level', 'parent', 'location', 'members', 'status', 'actions'];

  ngOnInit() { this.loadData(); }

  private async loadData() {
    this.loading.set(true);
    try {
      const [orgs, tree, levels] = await Promise.all([
        firstValueFrom(this.orgService.getAll()),
        firstValueFrom(this.orgService.getTree()),
        firstValueFrom(this.orgService.getLevels()),
      ]);
      this.organizations.set(orgs);
      this.levels.set(levels);
      this.treeData.set(tree);
      Promise.resolve().then(() => this.tree?.expandAll());
    } finally {
      this.loading.set(false);
    }
  }

  levelIndent(level: number): number {
    return (level - 1) * (this.isMobile() ? 16 : 32);
  }

  levelName(level: number): string {
    return this.levels().find(l => l.level === level)?.displayName ?? `Level ${level}`;
  }

  levelColor(level: number): string {
    return LEVEL_COLORS[level] ?? '#f5f5f5';
  }

  levelIcon(level: number): string {
    const icons: Record<number, string> = { 1: 'hub', 2: 'location_city', 3: 'church' };
    return icons[level] ?? 'corporate_fare';
  }

  openCreateDialog(parentNode?: OrganizationTree) {
    const ref = this.dialog.open(OrganizationFormDialogComponent, {
      width: '620px', maxWidth: '95vw',
      data: {
        organization: parentNode
          ? { parentOrganizationId: parentNode.id, level: parentNode.level + 1 }
          : undefined,
        levels: this.levels(),
        parentOrganizations: this.organizations(),
      },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  openCreateDialogForParent(org: Organization) {
    const ref = this.dialog.open(OrganizationFormDialogComponent, {
      width: '620px', maxWidth: '95vw',
      data: {
        organization: { parentOrganizationId: org.id, level: org.level + 1 },
        levels: this.levels(),
        parentOrganizations: this.organizations(),
      },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  openEditDialog(id: number) {
    const org = this.organizations().find(o => o.id === id);
    if (!org) return;
    const ref = this.dialog.open(OrganizationFormDialogComponent, {
      width: '620px', maxWidth: '95vw',
      data: { organization: org, levels: this.levels(), parentOrganizations: this.organizations() },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }

  openSettingsDialog(id: number) {
    const org = this.organizations().find(o => o.id === id);
    const ref = this.dialog.open(OrganizationSettingsDialogComponent, {
      width: '580px', maxWidth: '95vw',
      data: { organizationId: id, orgName: org?.name ?? '' },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.loadData(); });
  }
}
